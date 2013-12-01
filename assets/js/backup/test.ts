module A{
    export module B{
        export class C{
            person: string;
        }
    }
}

var c:A.B.C = new A.B.C();
c.person = "here here";