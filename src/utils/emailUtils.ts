interface Professor {
  name: string;
  email: string;
  position: string;
  institution: string;
  generatedEmail: string;
  recentWork: string;
}

export const processEmails = (results: Professor[], userName: string): Professor[] => {
  console.log('Processing emails with user name:', userName);
  return results.map(result => ({
    ...result,
    generatedEmail: result.generatedEmail
      .replace(/undefined/g, userName)
      .replace(/\[Your name\]|\[your name\]/gi, userName)
  }));
};