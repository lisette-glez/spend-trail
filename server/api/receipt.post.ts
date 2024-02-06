export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    // Read the multipart/form-data body
    const body = await readMultipartFormData(event);
    const newformData = new FormData();

    // Append the data to a new FormData (need to convert Buffer into string / Blob)
    const blob = new Blob([body![0].data], { type: body![0].type });
    newformData.append("document", blob);

    return await $fetch(
      "https://api.mindee.net/v1/products/mindee/expense_receipts/v5/predict",
      {
        method: "POST",
        headers: {
          Authorization: `Token ${config.mindee.apiKey}`,
        },
        body: newformData,
      }
    );
  } catch (error) {
    console.log(error);
    throw createError({
      statusCode: 500,
      statusMessage: "Something went wrong",
    });
  }
});
