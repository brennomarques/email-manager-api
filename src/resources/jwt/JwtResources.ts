import jwt from 'jsonwebtoken';

class JwtResources {
  public async generateToken(params = {}) {
    const token = jwt.sign(params, process.env.SECRET, { expiresIn: 86400 });
    return { token_type: 'Bearer', expires_in: 86400, access_token: token };
  }
}

export default new JwtResources();
