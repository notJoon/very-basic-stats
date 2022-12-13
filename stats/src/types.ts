export type RepositoryData = {
    name: string;
    nameWithOwner: String;
    isPrivate: boolean;
    isTemplate: boolean;
    isArchived: boolean;
    stargazers: {
        totalCount: number;
    };
    description: string;
    primaryLanguage: {
        color: string;
        id: string;
        name: string;
    };
    forkCount: number;
    starCount: number;
}

export type StatsData = {
    name: string;
    pullRequests: number;
    commits: number;
    issues: number;
    stars: number;
    contributedTo: number;
}

export type LanguageData = {
    name: string;
    color: string;
    id: string;
}