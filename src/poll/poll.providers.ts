import { DATA_SOURCE } from "@src/database/database.constants";
import { Poll } from "./entities/poll.entity";
import { POLL_REPOSITORY } from "./poll.constatns";


export const pollProviders = [
    {
        provide: POLL_REPOSITORY,
        useFactory: (dataSource) => dataSource.getRepository(Poll),
        inject: [DATA_SOURCE],
    }
]