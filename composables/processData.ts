import type { Document } from "../types/document";

export const useProcessData = async (apiUrl: string, file: File) => {
  try {
    const formData = new FormData();
    formData.append("document", file);
    return await $fetch<Document>(apiUrl, {
      method: "POST",
      body: formData,
    });
  } catch (error) {
    console.log(error);
    alert("Sorry! Error occurred while processing the file");
  }
};
