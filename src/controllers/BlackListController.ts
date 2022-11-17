import BlackList from '@models/BlackList';
import JwtResources from '@resources/jwt/JwtResources';

export class BlackListController {
  public async storeInBlackList(token: string) {
    const idUser = await JwtResources.decodeToken(token);

    await BlackList.create({ idUser, token });

    return { revoked: true };
  }

  public async showTokenInBlackList(token: string) {
    const tokenRevoked = await BlackList.findOne({ token });
    return tokenRevoked;
  }
}
