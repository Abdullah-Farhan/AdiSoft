import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema({
    timestamps: true
})

export class User {

    @Prop({required:true, type:String})
    name: string

    @Prop({ unique: [true, 'Account already exists']})
    email: string

    @Prop({required:true, type:String})
    password: string

    @Prop({required:true, type:String})
    type: string

    @Prop({default:'Null', required:true, type:String})
    otp: string

    @Prop({default:false, required:true, type:String})
    verified: boolean
}

export const UserSchema = SchemaFactory.createForClass(User);