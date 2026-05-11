import { Permission } from '../../common/enums/permissions.enum';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn({ comment: 'Unique identifier of the user' })
    id: number;

    @Column({ comment: 'Full name of the user' })
    name: string;

    @Column({ unique: true, comment: 'Unique email address used for authentication' })
    email: string;

    @Column({ comment: 'Hashed password of the user' })
    password: string;

    @CreateDateColumn({ name: 'created_at', comment: 'Timestamp when the user account was created' })
    createdAt: Date;

    @Column({
        type: 'enum',
        enum: Permission,
        array: true,
        default: [Permission.CREATE_POLL, Permission.WATCH_POLL],
        comment: 'List of permissions granted to the user'
    })
    permissions: Permission[]
}
