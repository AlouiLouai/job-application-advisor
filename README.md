# Job Application Advisor

A multi-screen web application that helps candidates determine if they should apply for specific job opportunities by analyzing their CV against job descriptions.

![Job Application Advisor Screenshot](/main.png?height=400&width=800)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technical Stack](#technical-stack)
- [Installation](#installation)
- [Usage](#usage)
- [API Integration](#api-integration)
- [Project Structure](#project-structure)
- [Customization](#customization)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

## Overview

Job Application Advisor is a Next.js application designed to help job seekers make informed decisions about which positions to apply for. By analyzing a candidate's CV against a job description, the application provides a match percentage, recommendation, and detailed explanation of the fit. Based on the analysis results, the application offers tailored next steps - either generating a cover letter for good matches or providing CV improvement suggestions for poor matches.

## Features

- **CV and Job Description Input**: Upload PDF CV and paste job description text
- **Application Analysis**: Process CV and job description to determine match percentage
- **Results Dashboard**: View match percentage, recommendation, and detailed explanation
- **Conditional Workflows**:
  - For matches > 65%: Option to generate a tailored cover letter
  - For matches < 65%: Option to receive CV improvement suggestions
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **User-Friendly Interface**: Clean, intuitive UI with appropriate loading states and transitions

## Technical Stack

- **Framework**: Next.js 14 (App Router)
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **API Integration**: Fetch API for external service communication
- **File Handling**: Native File API for PDF uploads

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/job-application-advisor.git
   cd job-application-advisor