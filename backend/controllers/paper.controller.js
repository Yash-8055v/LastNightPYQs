import { Paper } from "../models/paper.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { deleteFromCloudinary } from "../utils/cloudinary.js";
import { v2 as cloudinary } from 'cloudinary';
import https from 'https';
import http from 'http';



export const getPapers = async (req, res) => {
  try {
    // Extract query parameters for filtering
    const { department, semester, year, subject } = req.query;
    
    // Build filter object dynamically
    const filter = {};
    
    if (department) {
      filter.department = department;
    }
    
    if (semester) {
      filter.semester = parseInt(semester);
    }
    
    if (year) {
      filter.year = parseInt(year);
    }
    
    if (subject) {
      // Case-insensitive partial match for subject
      filter.subject = { $regex: subject, $options: 'i' };
    }
    
    // Find papers with filters and sort by creation date (newest first)
    const papers = await Paper.find(filter).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: papers.length,
      papers
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching papers", error: error.message });
  }
};

export const getStats = async (req, res) => {
  try {
    const totalPdfs = await Paper.countDocuments();
    const latest = await Paper.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      totalPdfs,
      totalDownloads: 0, // future feature
      thisMonthUploads: latest.length,
      recentUploads: latest,
    });
  } catch (err) {
    res.status(500).json({ message: "Stats fetch failed", err });
  }
};


export const uploadPaper = async (req, res) => {
  try {
    console.log("Body:", req.body);
    console.log("File:", req.file);
    const { subject, department, semester, year } = req.body;

    if (!req.file) return res.status(400).json({ message: "No PDF uploaded" });

    // Upload to cloudinary
    const result = await uploadOnCloudinary(req.file.path);

    const newPaper = new Paper({
      subject,
      department,
      semester,
      year,
      pdfUrl: result.secure_url,
    });

    await newPaper.save();
    res.status(201).json({
      message: "Paper uploaded successfully",
      paper: newPaper,
    });
  } catch (error) {
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};

export const downloadPaper = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Download request for paper ID:", id);
    
    // Find the paper
    const paper = await Paper.findById(id);
    
    if (!paper) {
      console.log("Paper not found:", id);
      return res.status(404).json({ message: "Paper not found" });
    }

    console.log("Paper found. URL:", paper.pdfUrl);

    // Helper function to fetch PDF from URL
    const fetchPDF = (url) => {
      return new Promise((resolve, reject) => {
        try {
          const urlObj = new URL(url);
          const client = urlObj.protocol === 'https:' ? https : http;
          
          console.log("Attempting to fetch from:", url);
          
          const request = client.get(url, (response) => {
            console.log("Response status:", response.statusCode);
            console.log("Response headers:", response.headers);
            
            if (response.statusCode !== 200) {
              reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage || 'Unknown error'}`));
              return;
            }
            
            const chunks = [];
            response.on('data', (chunk) => chunks.push(chunk));
            response.on('end', () => {
              const buffer = Buffer.concat(chunks);
              console.log("Successfully fetched PDF, size:", buffer.length, "bytes");
              resolve(buffer);
            });
            response.on('error', (err) => {
              console.error("Response error:", err);
              reject(err);
            });
          });
          
          request.on('error', (err) => {
            console.error("Request error:", err);
            reject(err);
          });
          
          request.setTimeout(30000, () => {
            request.destroy();
            reject(new Error('Request timeout'));
          });
        } catch (urlErr) {
          console.error("URL error:", urlErr);
          reject(urlErr);
        }
      });
    };

    let pdfBuffer;
    let usedUrl = paper.pdfUrl;
    
    // Helper to get authenticated URL from Cloudinary
    const getAuthenticatedUrl = (url) => {
      try {
        // Extract public ID from URL
        // Format: https://res.cloudinary.com/{cloud_name}/{resource_type}/upload/{version}/{public_id}.{format}
        const urlParts = url.split('/upload/');
        if (urlParts.length !== 2) return url;
        
        const versionAndPublicId = urlParts[1];
        const parts = versionAndPublicId.split('/');
        const version = parts[0];
        const publicIdWithFormat = parts.slice(1).join('/');
        const publicId = publicIdWithFormat.replace(/\.[^.]+$/, ''); // Remove extension
        const resourceType = url.includes('/raw/') ? 'raw' : (url.includes('/image/') ? 'image' : 'auto');
        
        console.log("Generating authenticated URL for:", publicId);
        
        // Generate signed/authenticated URL using Cloudinary SDK
        const authenticatedUrl = cloudinary.url(publicId, {
          resource_type: resourceType,
          version: version,
          secure: true,
          sign_url: false, // Try without signing first
        });
        
        console.log("Authenticated URL:", authenticatedUrl);
        return authenticatedUrl;
      } catch (urlErr) {
        console.error("Error generating authenticated URL:", urlErr);
        return url;
      }
    };
    
    // Try original URL first
    try {
      console.log("Trying original URL:", paper.pdfUrl);
      pdfBuffer = await fetchPDF(paper.pdfUrl);
      usedUrl = paper.pdfUrl;
    } catch (err) {
      console.log("Original URL failed:", err.message);
      
      // If error contains "untrusted", try authenticated URL
      if (err.message.includes('untrusted') || err.message.includes('401') || err.message.includes('403')) {
        console.log("Account may be untrusted, trying authenticated URL...");
        const authUrl = getAuthenticatedUrl(paper.pdfUrl);
        try {
          pdfBuffer = await fetchPDF(authUrl);
          usedUrl = authUrl;
          console.log("Authenticated URL worked!");
        } catch (authErr) {
          console.error("Authenticated URL also failed:", authErr.message);
        }
      }
      
      // If still failed and URL contains /image/upload/, try converting to /raw/upload/
      if (!pdfBuffer && paper.pdfUrl.includes('/image/upload/')) {
        const rawUrl = paper.pdfUrl.replace('/image/upload/', '/raw/upload/');
        console.log("Trying converted URL:", rawUrl);
        try {
          pdfBuffer = await fetchPDF(rawUrl);
          usedUrl = rawUrl;
        } catch (rawErr) {
          console.error("Converted URL also failed:", rawErr.message);
          
          // Last attempt: authenticated raw URL
          if (rawErr.message.includes('untrusted') || rawErr.message.includes('401') || rawErr.message.includes('403')) {
            const authRawUrl = getAuthenticatedUrl(rawUrl);
            try {
              pdfBuffer = await fetchPDF(authRawUrl);
              usedUrl = authRawUrl;
            } catch (authRawErr) {
              console.error("All attempts failed");
            }
          }
          
          if (!pdfBuffer) {
            return res.status(500).json({ 
              message: "Failed to fetch PDF from Cloudinary. Your account may need verification.",
              error: `Original: ${err.message}, Raw: ${rawErr.message}`,
              suggestion: "Please verify your Cloudinary account or contact Cloudinary support. See CLOUDINARY_SETTINGS.md for details.",
              originalUrl: paper.pdfUrl,
              convertedUrl: rawUrl
            });
          }
        }
      } else if (!pdfBuffer) {
        console.error("All download attempts failed");
        return res.status(500).json({ 
          message: "Failed to fetch PDF from Cloudinary. Your account may need verification.",
          error: err.message,
          suggestion: "Please verify your Cloudinary account. Your account is marked as 'untrusted'. Contact Cloudinary support to resolve this.",
          url: paper.pdfUrl
        });
      }
    }

    // Set headers to force download
    const fileName = `${paper.subject.replace(/[^a-z0-9]/gi, '_')}_${paper.year}_paper.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    
    console.log("Sending PDF to client, size:", pdfBuffer.length);
    
    // Send the PDF
    res.send(pdfBuffer);
    
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ 
      message: "Download failed", 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const deletePaper = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);

    if (!paper) {
      return res.status(404).json({ message: "Paper not found" });
    }

    // Extract Cloudinary public id
    const pdfUrlParts = paper.pdfUrl.split("/");
    const fileName = pdfUrlParts[pdfUrlParts.length - 1].split(".")[0];

    await deleteFromCloudinary(fileName);
    await paper.deleteOne();

    res.status(200).json({ message: "Paper deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error: error.message });
  }
};
