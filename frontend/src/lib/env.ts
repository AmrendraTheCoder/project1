class Env {
  static BACKEND_URL: string = process.env.NEXT_AUTH_BACKEND_APP_URL as string;
  static APP_URL: string = process.env.NEXT_AUTH_APP_URL!;
}

export default Env