import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import exp from "constants";

@Schema({
    timestamps: true
})

export class User {

    @Prop({required:true, type:String})
    name: string;

    @Prop({required:true, type:String})
    email: string;

    @Prop({required:true, type:String})
    password: string;

    @Prop({required:true, type:String})
    type: string;
}

export const UserSchema = SchemaFactory.createForClass(User);