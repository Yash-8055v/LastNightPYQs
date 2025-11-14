// Subject data organized by semester
// This ensures consistent subject names across upload and download

export const SUBJECTS_BY_SEMESTER = {
  1: [
    'Engineering Mathematics I',
    'Engineering Physics',
    'Engineering Chemistry',
    'Programming Fundamentals',
    'Engineering Graphics',
    'Communication Skills'
  ],
  2: [
    'Engineering Mathematics II',
    'Data Structures',
    'Object Oriented Programming',
    'Digital Electronics',
    'Engineering Mechanics',
    'Environmental Studies'
  ],
  3: [
    'Discrete Mathematics',
    'Database Management Systems',
    'Computer Networks',
    'Operating Systems',
    'Web Technologies',
    'Probability and Statistics'
  ],
  4: [
    'Computer Organization and Architecture',
    'Theory of Computation',
    'Software Engineering',
    'Microprocessors',
    'Design and Analysis of Algorithms',
    'Computer Graphics'
  ],
  5: [
    'Machine Learning',
    'Compiler Design',
    'Mobile Computing',
    'Information Security',
    'Cloud Computing',
    'Artificial Intelligence'
  ],
  6: [
    'Deep Learning',
    'Distributed Systems',
    'Internet of Things',
    'Blockchain Technology',
    'Big Data Analytics',
    'Human Computer Interaction'
  ],
  7: [
    'Natural Language Processing',
    'Computer Vision',
    'DevOps',
    'Cybersecurity',
    'Advanced Database Systems',
    'Project Management'
  ],
  8: [
    'Capstone Project',
    'Internship',
    'Industrial Training',
    'Research Methodology',
    'Ethics and Professional Practice'
  ]
};

// Get subjects for a specific semester
export const getSubjectsBySemester = (semester) => {
  return SUBJECTS_BY_SEMESTER[semester] || [];
};

// Get all unique subjects across all semesters
export const getAllSubjects = () => {
  const allSubjects = new Set();
  Object.values(SUBJECTS_BY_SEMESTER).forEach(subjects => {
    subjects.forEach(subject => allSubjects.add(subject));
  });
  return Array.from(allSubjects).sort();
};

// Check if a subject belongs to a semester
export const isSubjectInSemester = (subject, semester) => {
  return SUBJECTS_BY_SEMESTER[semester]?.includes(subject) || false;
};

