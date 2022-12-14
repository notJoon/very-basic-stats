import axios from "axios";
import MockAdaptor from "axios-mock-adapter";
import { fetchRepo } from "../src/api";

const dummy_repo = {
    repository: {
        name: "dummy_repo",
        description: "dummy description",
        stargazers: { totalCount: 38000 },
        primaryLanguage: {
            name: "typescript",
            id: "MDg6TGFuZ3VhZ2UyMjQ=",
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

const organizationData = {
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
        mock.onPost("https://api.github.com/graphql")
            .reply(200, user_data);

        let repo = await fetchRepo("dummy_user", "dummy_repo");

        expect(repo).toEqual({
            ...dummy_repo.repository,
            starCount: dummy_repo.repository.stargazers.totalCount,
        })
    })
});