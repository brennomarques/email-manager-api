import jwt from 'jsonwebtoken';

class JwtResources {
  public async generateToken(params = {}) {
    const token = jwt.sign(params, process.env.APP_SECRET, { expiresIn: 86400 });
    return {
      token_type: 'Bearer', expires_in: 86400, access_token: token,
    };
  }

  public async decodeToken(token: string) {
    const decode = jwt.decode(token);
    return decode.id;
  }

  public async revoke(token: string) {
    const newToken = jwt.sign(token, process.env.APP_SECRET, { expires_in: 1 });

    if (newToken) {
      return { message: 'You have been Logged Out' };
    }
    return { massage: 'Error', error: 'err' };
  }
}

export default new JwtResources();
