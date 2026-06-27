const NEXT_PUBLIC_BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
export type ContactFormData = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

export async function fetchContactData(lang = "en") {
  try {
    const response = await fetch(`${NEXT_PUBLIC_BACKEND_BASE_URL}/contact-us`, {
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": lang,
      },
      method: "GET",
    });

    const data = await response.json();


    if (!response.ok) {
      console.error("Failed to fetch contact us data:", data);
      return { success: false, message: "Failed To Fetch Contact Us Data" };
    }

    return data;
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Internal Server Error";
    console.error("Home data fetch error:", errorMessage);
    return { success: false, message: errorMessage };
  }
}

export async function sendContactData(formData: ContactFormData) {
  try {
    const response = await fetch(
      `${NEXT_PUBLIC_BACKEND_BASE_URL}/save-contact-us`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Failed to send contact data:", data);
      return {
        success: false,
        message: data?.message || "Failed to send contact data",
      };
    }

    return { success: true, data };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Internal Server Error";
    console.error("Contact form submission error:", errorMessage);
    return { success: false, message: errorMessage };
  }
}
