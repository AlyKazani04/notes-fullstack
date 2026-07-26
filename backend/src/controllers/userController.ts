import { Request, Response } from 'express';


export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      sameSite: 'lax',
    })

    res.status(200).json({
      message: "Server: User Logged Out"
    })
  } catch (error) {
    console.error('Logout Error', error);

    res.status(500).json({
      message: 'Server: Logout Failed',
      error: error instanceof Error ? error.message : 'Unknown Error',
    });
  }
}
