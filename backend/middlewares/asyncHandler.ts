import { Request, Response, NextFunction, RequestHandler } from "express";

const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>,
): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
      res.status(statusCode).json({ message: (error as Error).message });
    });
  };
};

export default asyncHandler;
