import { Request, Response, Router } from 'express';

const router = Router();

router.get('/health-check', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Successfully connected to API.',
  });
});

export default router;
