import jwt from 'jsonwebtoken';

class JwtResources {
  public async generateToken(params = {}) {
    const token = jwt.sign(params, process.env.SECRET, { expiresIn: 86400 });
    return {
      token_type: 'Bearer', expires_in: 86400, access_token: token, refreshToken: 'refreshToken',
    };
  }

  public async revoke(token: string) {
    const newToken = jwt.sign(token, process.env.SECRET, { expires_in: 1 });

    if (newToken) {
      return { message: 'You have been Logged Out' };
    }
    return { massage: 'Error', error: 'err' };
  }
}

export default new JwtResources();
