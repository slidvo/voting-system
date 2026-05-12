import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Poll } from "./poll.entity";
import { Option } from "./option.entity";

@Entity({ name: "questions" })
export class Question {

    @PrimaryGeneratedColumn({ comment: "Question ID" })
    id: number;

    //TODO rename text to ?
    @Column({ comment: "Text of the question" })
    text: string;

    //TODO add default value
    @Column({ comment: "Question creation timestamp" })
    createdAt: Date;

    @Column({ name: 'poll_id', comment: "Foreign key referencing the associated poll" })
    pollId: number;

    @ManyToOne(() => Poll, poll => poll.questions)
    @JoinColumn({ name: "poll_id" })
    poll: Poll;

    @OneToMany(() => Option, option => option.question, { cascade: true, onDelete: "CASCADE" })
    options: Option[];

}