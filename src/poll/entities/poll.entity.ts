import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Question } from "./question.entity";

@Entity({ name: "polls" })
export class Poll {
    @PrimaryGeneratedColumn({ comment: "Poll ID" })
    id: number;

    @Column({ comment: "Poll title" })
    title: string;

    @Column({ comment: "Poll description" })
    description: string;

    //TODO add default value
    @Column({ comment: "Poll creation timestamp" })
    createdAt: Date;

    @OneToMany(() => Question, question => question.poll, { cascade: true, onDelete: "CASCADE" })
    questions: Question[];

}
