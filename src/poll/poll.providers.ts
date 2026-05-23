import { DATA_SOURCE } from "@src/database/database.constants";
import { Poll } from "./entities/poll.entity";
import { ANSWER_REPOSITORY, POLL_REPOSITORY } from "./poll.constatns";
import { Answer } from "./entities/answer.entity";


export const pollProviders = [
    {
        provide: POLL_REPOSITORY,
        useFactory: (dataSource) => dataSource.getRepository(Poll),
        inject: [DATA_SOURCE],
    },
    {
        provide: ANSWER_REPOSITORY,
        useFactory: (dataSource) => dataSource.getRepository(Answer),
        inject: [DATA_SOURCE],
    }
]