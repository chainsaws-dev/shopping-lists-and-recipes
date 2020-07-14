export class Ingredient{
    constructor(public Name: string, public Amount: number){}
}

export class ShoppingListResponse {
  public Items: Ingredient[];
  public Total: number;
  public Offset: number;
  public Limit: number;
}
