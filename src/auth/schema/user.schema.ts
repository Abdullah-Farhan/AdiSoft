import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema({
    timestamps: true
})

export class User {

    @Prop()
    name: string

    @Prop({ unique: [true, 'Account already exists']})
    email: string

    @Prop()
    password: string

    @Prop()
    type: string

    @Prop({default:'Null'})
    otp: string

    @Prop({default:false})
    verified: boolean
}

export const UserSchema = SchemaFactory.createForClass(User);