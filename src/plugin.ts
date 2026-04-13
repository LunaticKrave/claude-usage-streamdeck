import streamDeck from "@elgato/streamdeck";
import { UsageDisplay } from "./actions/usage-display";

streamDeck.actions.registerAction(new UsageDisplay());
streamDeck.connect();
