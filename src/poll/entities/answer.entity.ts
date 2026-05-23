import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Option } from "./option.entity";

@Entity({ name: "answers" })
@Unique(['userId', 'optionId'])
export class Answer {

    @PrimaryGeneratedColumn({ comment: "Answer ID" })
    id: number;

    @Column({ name: "user_id", comment: "Foreign key referencing the user who submitted the answer" })
    userId: number;

    @Column({ name: "option_id", comment: "Foreign key referencing the selected option" })
    optionId: number;

    //TODO add default value
    @Column({ name: "created_at", comment: "Answer creation timestamp" })
    createdAt: Date;

    @ManyToOne(() => Option, option => option.answers)
    @JoinColumn({ name: "option_id" })
    option?: Option;
}