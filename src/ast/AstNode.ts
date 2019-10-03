export abstract class AstNode {

    // Declaring return type as any for now, we can get more specific later as we go
    public abstract parse(): any;

    // Declaring return type as any for now, we can get more specific later as we go
    public abstract evaluate(): any;
}
