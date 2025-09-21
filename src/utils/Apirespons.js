class ApiResponse {
    constructor(res, data, message = "Success", statusCode = 200) {
        this.res = res;
        this.data = data;
        this.message = message;
        this.statusCode = statusCode;
    }

    send() {
        this.res.status(this.statusCode).json({
            success: true,
            message: this.message,
            data: this.data
        });
    }

    static sendError(res, error, statusCode = 500) {
        res.status(statusCode).json({
            success: false,
            message: error.message || "Internal Server Error",
            error: error
        });
    }
}
export { ApiResponse };