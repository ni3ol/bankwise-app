import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Container, Grid, Header, Segment } from "semantic-ui-react";
import { getDailySummaries } from "src/daily-summaries/actions/get-daily-summaries";
import { getUser } from "src/users/actions/get-user";
import { usePromise } from "src/utils";
import { getCalorieLimit } from "../actions/get-calorie-limit";
import { getFoodEntries } from "../actions/get-food-entries";
import { getMonthlySpendSummary } from "../actions/get-monthly-spend-summary";
import { DailySummaryTable } from "./daily-summary-table";
import { FoodEntryTable } from "./food-entry-table";
import { MonthlySpendSummaryTable } from "./monthly-spend-summary-table";
import { NewFoodEntryModal } from "./new-food-entry-modal";
import { UpdateFoodEntryModal } from "./update-food-entry-modal";

export const FoodEntryListView = () => {
  const [showNewFoodEntryModal, setShowNewFoodEntryModal] = useState(false);
  const [foodEntryIdToUpdate, setFoodEntryIdToUpdate] = useState();

  const { result: user } = usePromise(async () => {
    const user = await getUser();
    return user;
  }, []);

  const { result: dailySummaries } = usePromise(async () => {
    const dailySummaries = await getDailySummaries();
    return dailySummaries;
  }, []);

  const { result: foodEntries, execute } = usePromise(async () => {
    const foodEntries = await getFoodEntries();
    return foodEntries;
  }, []);

  const { result: calorieLimit } = usePromise(async () => {
    const calorieLimit = await getCalorieLimit();
    return calorieLimit;
  }, []);

  const { result: monthlySpendSummary } = usePromise(async () => {
    const monthlySpendSummary = await getMonthlySpendSummary();
    return monthlySpendSummary;
  }, []);

  console.log('ssss', monthlySpendSummary)

  const foodEntryToUpdate = foodEntries?.find(
    (foodEntry) => foodEntry.id === foodEntryIdToUpdate
  );

  return (
    <>
      {showNewFoodEntryModal && (
        <NewFoodEntryModal
          onClose={() => setShowNewFoodEntryModal(false)}
          onFoodEntryCreated={() => {
            execute();
          }}
        />
      )}
      {foodEntryIdToUpdate && foodEntryToUpdate && (
        <UpdateFoodEntryModal
          onClose={() => {
            setFoodEntryIdToUpdate(undefined);
            setFoodEntryIdToUpdate(undefined);
          }}
          foodEntry={foodEntryToUpdate}
          onFoodEntryUpdated={() => {
            execute();
          }}
        />
      )}
      <Container style={{ marginTop: 30 }}>
        {user?.isAdmin && <Link to="/admin">Go to admin page</Link>}
        <Grid columns={2}>
          <Grid.Column verticalAlign="middle">
            <Header>Food entries</Header>
          </Grid.Column>
          <Grid.Column textAlign="right">
            <Button primary onClick={() => setShowNewFoodEntryModal(true)}>
              New food entry
            </Button>
          </Grid.Column>
        </Grid>

        <FoodEntryTable
          entries={foodEntries || []}
          onEditClick={(foodEntryId) => {
            setFoodEntryIdToUpdate(foodEntryId);
          }}
        />

        <Grid columns={2}>
          <Grid.Column verticalAlign="middle">
            <Header>Monthly summary</Header>
          </Grid.Column>
        </Grid>
        <MonthlySpendSummaryTable entry={monthlySpendSummary || []}/>

        <Grid columns={2}>
          <Grid.Column verticalAlign="middle">
            <Header>Daily summaries</Header>
          </Grid.Column>
        </Grid>
        <p>
          Calorie limit: <b>{calorieLimit}</b>
        </p>
        <DailySummaryTable entries={dailySummaries || []} />
      </Container>
    </>
  );
};
