import { User } from '@models/User';

export class UsersController {
  private str = 'foo';

  private bool = true;

  public gr = 1;

  public teste(): number {
    // const user = new User();
    const whos = new User();

    whos.name = 'John Doe';
    const a = 2;
    const b = 3;

    let g = a;

    g = a + b;
    console.log(g);
    return 1;
  }

  isCheck(): string {
    const b = this.teste();
    const mess = `Menssage${b}`;
    console.log(b, mess);

    const g = 'ge';

    if (g) {
      return g;
    }
    return 'Ronaldo';
  }
}
