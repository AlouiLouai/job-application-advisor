import { Upload, CheckCircle } from "lucide-react";

export default function UploadCV({
  file,
  onChange,
}: {
  file: File | null;
  onChange: (file: File) => void;
}) {
  return (
    <div>
      <label className="text-sm font-medium flex items-center mb-2">
        <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded-full mr-2">
          Step 1
        </span>
        Upload your CV (PDF)
      </label>
      <div
        className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-all ${
          file ? "border-green-500 bg-green-50" : "border-gray-300"
        }`}
        onClick={() => document.getElementById("cv-upload")?.click()}
      >
        {file ? (
          <div className="text-green-600 text-center">
            <CheckCircle className="h-5 w-5 mx-auto mb-2" />
            <p className="text-sm">{file.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">Click to change</p>
          </div>
        ) : (
          <div className="text-gray-500 text-center">
            <Upload className="h-5 w-5 mx-auto mb-2" />
            <p className="text-sm">Click to upload your CV</p>
            <p className="text-xs">PDF format only</p>
          </div>
        )}
        <input
          id="cv-upload"
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) onChange(e.target.files[0]);
          }}
        />
      </div>
    </div>
  );
}
