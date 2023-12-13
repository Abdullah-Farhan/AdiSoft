import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema({
    timestamps: true
})

export class Investor {

    @Prop({required:true, type:String})
    name: string

    @Prop({ unique: [true, 'Account already exists']})
    email: string

    @Prop({required:true, type:String})
    password: string

    @Prop({required:true, type:String})
    phno: string

    @Prop({required:true, type:String})
    type: string

    @Prop({required:true, type:String})
    investings: string

    @Prop({default:'Null', required:true, type:String})
    details: string

    @Prop({default:false, required:true, type:String})
    verified: boolean
}

export const InvestorSchema = SchemaFactory.createForClass(Investor);