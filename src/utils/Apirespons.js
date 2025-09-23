class ApiResponse {
  constructor(data, message = "Success", statusCode = 200) {
    this.data = data;
    this.message = message;
    this.statusCode = statusCode;
    this.success = true;
  }

  send(res) {
    return res.status(this.statusCode).json({
      success: this.success,
      message: this.message,
      data: this.data,
    });
  }

  static sendError(res, error, statusCode = 500) {
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Internal Server Error",
      errors: error.errors || error, // matches ApiError.errors if thrown
    });
  }
}

export { ApiResponse };
