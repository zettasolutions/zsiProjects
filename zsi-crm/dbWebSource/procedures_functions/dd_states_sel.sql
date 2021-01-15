CREATE PROCEDURE [dbo].[dd_states_sel]
( 
     @user_id INT = NULL
	,@country_id INT = NULL
)
AS
BEGIN
	SELECT state_id, state_name FROM zsi_afcs.dbo.states WHERE country_id = @country_id;
 END;