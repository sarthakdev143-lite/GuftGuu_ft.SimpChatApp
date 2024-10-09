// This will use the `NEXT_PUBLIC_BASE_URL` environment variable or default to localhost if not set
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8080/chat";

export default BASE_URL;