



CREATE PROCEDURE [dbo].[dd_banks_sel]
( 
    @user_id INT = NULL
)
AS
BEGIN
	SELECT * FROM zsi_afcs.dbo.banks WHERE is_active='Y';
 END;




