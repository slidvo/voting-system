import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Question } from "./question.entity";
import { User } from "../../user/entities/user.entity";

@Entity({ name: "polls" })
export class Poll {
    @PrimaryGeneratedColumn({ comment: "Poll ID" })
    id: number;

    @Column({ comment: "Poll title" })
    title: string;

    @Column({ comment: "Poll description" })
    description: string;

    //TODO add default value
    @Column({ comment: "Poll creation timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @Column({ comment: "ID of the user who created the poll", nullable: true, name: "created_by" })
    createdBy?: number;

    @Column({ comment: "Indicates whether the poll is active and can receive votes", default: true })
    isActive: boolean;

    @ManyToOne(() => User, user => user.polls, { nullable: true })
    creator?: User;

    @OneToMany(() => Question, question => question.poll, { cascade: true, onDelete: "CASCADE" })
    questions?: Question[];

}
