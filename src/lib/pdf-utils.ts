import { jsPDF } from "jspdf"
import "jspdf-autotable"

export function generateCoverLetterPDF(coverLetter: string, candidateName = "Your Name"): void {
  // Initialize PDF document
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  // Set document properties
  doc.setProperties({
    title: "Cover Letter",
    subject: "Job Application Cover Letter",
    author: candidateName,
    creator: "Job Application Advisor",
  })

  // Add fonts
  doc.setFont("helvetica", "normal")

  // Set margins
  const margin = 20 // mm
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const contentWidth = pageWidth - 2 * margin

  // Add current date
  const today = new Date()
  const formattedDate = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  doc.setFontSize(10)
  doc.text(formattedDate, margin, margin)

  // Add candidate name
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text(candidateName, margin, margin + 10)

  // Add a line for contact info (placeholder)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.text("your.email@example.com | (123) 456-7890 | City, State", margin, margin + 15)

  // Add a separator line
  doc.setDrawColor(200, 200, 200)
  doc.line(margin, margin + 20, pageWidth - margin, margin + 20)

  // Add cover letter content
  doc.setFont("helvetica", "normal")
  doc.setFontSize(11)

  // Split the cover letter into paragraphs
  const paragraphs = coverLetter.split("\n\n")

  let yPosition = margin + 30

  // Process each paragraph
  paragraphs.forEach((paragraph) => {
    if (paragraph.trim() === "") return

    // Check if we need a new page
    if (yPosition > pageHeight - margin) {
      doc.addPage()
      yPosition = margin
    }

    // Split paragraph into lines that fit within the content width
    const lines = doc.splitTextToSize(paragraph, contentWidth)

    // Add the lines to the document
    doc.text(lines, margin, yPosition)

    // Move position for next paragraph (add some spacing)
    yPosition += lines.length * 6 + 4
  })

  // Save the PDF
  doc.save("Cover_Letter.pdf")
}
