import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Question } from "./question.entity";
import { Answer } from "./answer.entity";

@Entity({ name: "options" })
export class Option {
    @PrimaryGeneratedColumn({ comment: "Option ID" })
    id: number;
    @Column({ comment: "Text of the option" })
    text: string;
    @Column({ name: "created_at", comment: "Option creation timestamp" })
    createdAt: Date;

    @Column({ name: "question_id", comment: "Foreign key referencing the associated question" })
    questionId: number;

    @ManyToOne(() => Question, question => question.options)
    @JoinColumn({ name: "question_id" })
    question: Question;

    @OneToMany(() => Answer, answer => answer.option)
    answers: Answer[];
}