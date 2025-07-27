// const PDF_SERVICE_URL = "http://localhost:8000"
const PDF_SERVICE_URL = "https://pdf2html-susv.onrender.com"

export async function pdfToHtml(file:File) {
    try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch(PDF_SERVICE_URL + "/convert",
            {
                method:"POST",
                body: formData
            }
        )
        if (!response.ok) {
            throw new Error("Failed to convert PDF to HTML")
        }
        const result = await response.json()
        const html = result?.html;
        if (!html) {
            throw new Error("Failed to convert PDF to HTML")
        }
        return html;
    } catch (error) {
        console.error("Error converting PDF to HTML", error)
    }
}