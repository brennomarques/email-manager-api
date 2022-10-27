export class Format {
  public static removeFormatting(document: string): string {
    return document.replace(/[^0-9]+/g, '');
  }

  public static cpf(document: string): string {
    return document.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4');
  }

  public static cnpf(document: string): string {
    return document.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g,
      '$1.$2.$3/$4-$5',
    );
  }

  public static phone(number: string): string {
    return number.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/g, '($1) $2 $3-$4');
  }

  public static phoneDDI(number: string): string {
    return number.replace(
      /(\d{2})(\d{2})(\d{1})(\d{4})(\d{4})/g,
      '+$1 ($2) $3 $4-$5',
    );
  }

  public static conversionToBoolean(value: string): boolean {
    return value.toLowerCase() === 'true' || value === '1';
  }
}
