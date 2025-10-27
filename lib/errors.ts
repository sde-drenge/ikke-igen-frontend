export class RateLimitError extends Error {
  constructor() {
    super("Rate limit exceeded");
    this.name = "RateLimitError";
  }
}

export class LoginError extends Error {
  constructor() {
    super("Invalid email or password");
    this.name = "LoginError";
  }
}
