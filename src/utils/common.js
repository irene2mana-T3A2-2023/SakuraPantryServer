// Export 'filterSchema' to removes specified fields (default: '__v', '_id') from a Mongoose schema's JSON representation.
export const filterSchema = (fieldsToExclude = ['__v', '_id']) => ({
  // Apply a transform function to modify the JSON output
  transform: (_, returnedObj) => {
    // Loop through and delete each specified field from the returned object
    fieldsToExclude.forEach((field) => delete returnedObj[field]);
  }
});

