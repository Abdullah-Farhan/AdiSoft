import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import exp from "constants";

@Schema({
    timestamps: true
})

export class User {

    @Prop()
    name: string;

    @Prop()
    email: string;

    @Prop()
    password: string;

    @Prop()
    type: string;
}

export const UserSchema = SchemaFactory.createForClass(User);