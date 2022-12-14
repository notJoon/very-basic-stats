import axios from "axios";
import MockAdaptor from "axios-mock-adapter";
import { fetchRepo } from "../src/api";

const PATH = "https://api.github.com/graphql";

const dummy_repo = {
    repository: {
        name: "dummy_repo",
        description: "dummy description",
        stargazers: { totalCount: 38000 },
        primaryLanguage: {
            name: "typescript",
            id: "soMERanDomIdhere=&",
            color: "#2b7489",
        },
        forkCount: 1000,
    }
}

const user_data = {
    data: {
        user: { repository: dummy_repo.repository },
        organizationData: null,
    },
};

const organization_data = {
    data: {
        user: null,
        organization: {
            repository: dummy_repo.repository
        },
    },
};

const mock = new MockAdaptor(axios);

afterEach(() => {
    mock.reset();
})

describe("fetch dummy repo", () => {
    it("should fetch correct user repo", async () => {
        mock.onPost(PATH)
            .reply(200, user_data);

        let repo = await fetchRepo("dummy_user", "dummy_repo");

        expect(repo).toEqual({
            ...dummy_repo.repository,
            starCount: dummy_repo.repository.stargazers.totalCount,
        });
    });

    it("should fetch org repo", async () => {
        mock.onPost(PATH)
            .reply(200, organization_data);

        let repo = await fetchRepo("dummy_org", "dummy_repo");
        expect(repo).toEqual({
            ...dummy_repo.repository,
            starCount: dummy_repo.repository.stargazers.totalCount,
        });
    });

    it("should throw error if user is not found but repo is null", async () => {
        mock.onPost(PATH)
            .reply(200, {
                data: {
                    user: null,
                    organization: null,
                },
            });

        await expect(fetchRepo("dummy_user", "dummy_repo"))
            .rejects.toThrow("user or organization is empty");
    });

    it("should throw error if org is found but repo is null", async () => {
        mock.onPost(PATH)
            .reply(200, {
                data: {
                    user: null,
                    organization: {
                        repository: null,
                    },
                },
            });

        await expect(fetchRepo("dummy_org", "dummy_repo"))
            .rejects.toThrow("repository is private or cannot found");
    });

    it ("should throw error if both user and org not found", async () => {
        mock.onPost(PATH)
            .reply(200, {
                data: {
                    user: null,
                    organization: null,
            }
        });

        await expect(fetchRepo("dummy_user", "dummy_repo"))
                .rejects
                .toThrow("user or organization is empty");
    });

    it("should throw error if repo is private", async () => {
        mock.onPost(PATH)
            .reply(200, {
                data: {
                    user: {
                        repository: { 
                            ...dummy_repo.repository, 
                            isPrivate: true,
                        }
                    },
                    organization_data: null,
                }
            }
        );

        await expect(fetchRepo("dummy_user", "dummy_repo"))
                .rejects
                .toThrow("User Repository Not found");
    })
});