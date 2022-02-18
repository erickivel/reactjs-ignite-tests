import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { mocked } from 'ts-jest/utils';
import { signIn, useSession } from "next-auth/react";
import { SubscribeButton } from ".";

jest.mock("next-auth/react", () => {
  return {
    useSession() {
      return [null, false]
    },
    signIn() {
      return undefined;
    }
  }
});

jest.mock('next/router');

describe("SubscribeButton component", () => {
  it("renders correctly", () => {
    render(<SubscribeButton />);

    expect(screen.getByText("Subscribe Now")).toBeInTheDocument();
  });

  it('redirects user to sign in when not authenticated', async () => {
    const signInMocked = mocked(signIn);

    const useSessionMocked = mocked(useSession)

    useSessionMocked.mockReturnValueOnce([, false])


    render(<SubscribeButton />)

    const subscribeButton = screen.getByText('Subscribe now');

    fireEvent.click(subscribeButton);

    expect(signInMocked).toHaveBeenCalled()
  })
});