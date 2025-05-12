# Job Application Advisor

![Job Application Advisor Screenshot](https://sjc.microlink.io/CR8QR7QA2puoy53-pN7iF3vllj8gTFahQ2pmMl7KBFRpRZ8LUG0Eqns60myl6etwn9qXnZexR-lTyCswtXVhOw.jpeg)

## 🚀 Live Demo

**Try it now:** [https://job-application-advisor.vercel.app/](https://job-application-advisor.vercel.app/)

## 📋 Overview

Job Application Advisor is an AI-powered web application that helps job seekers make informed decisions about which positions to apply for. By analyzing a candidate's CV against a job description, the application provides a match percentage, personalized recommendations, and detailed explanations of the fit.

Based on the analysis results, the application offers tailored next steps:
- For good matches (>65%): Generate a customized cover letter
- For poor matches (<65%): Provide specific CV improvement suggestions

## ✨ Features

### CV and Job Description Analysis
- Upload your CV (PDF format)
- Paste any job description
- Receive an instant analysis with match percentage

### Smart Recommendations
- Get a clear "Yes," "Maybe," or "No" recommendation
- View detailed explanation of your match strengths and weaknesses
- See your match percentage visualized

### Personalized Cover Letter Generation
- For good matches, generate a tailored cover letter
- Download the cover letter as a PDF
- Get professional formatting ready for submission

### CV Improvement Suggestions
- For poor matches, receive specific improvement tips
- Get a gap analysis highlighting missing skills and experience
- Learn exactly what to add to your CV to improve your chances

## 🛠️ How It Works

1. **Upload Your CV**: Start by uploading your CV in PDF format
2. **Enter Job Description**: Paste the complete job description
3. **Analyze**: Click "Analyze My Application" to process your information
4. **Review Results**: See your match percentage and recommendation
5. **Next Steps**:
   - If match > 65%: Generate a tailored cover letter
   - If match < 65%: Get CV improvement suggestions
6. **Download or Start Over**: Download your cover letter as a PDF or analyze another job

## 💻 Technical Details

### Built With
- **Framework**: Next.js 15 (App Router)
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **PDF Generation**: jsPDF
- **Deployment**: Vercel

### API Integration
The application integrates with specialized AI endpoints for:
- CV and job description analysis
- Cover letter generation
- CV improvement suggestions

## 🔒 Privacy & Security

- Your CV and job descriptions are only used for analysis purposes
- No personal data is stored after your session ends
- All processing happens securely via encrypted connections

## 🚀 Getting Started

### Using the Live Demo
1. Visit [https://job-application-advisor.vercel.app/](https://job-application-advisor.vercel.app/)
2. Upload your CV (PDF format)
3. Paste a job description you're interested in
4. Click "Analyze My Application"
5. Follow the recommendations provided

### Running Locally
If you want to run the application locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/alouilouai/job-application-advisor.git
   cd job-application-advisor