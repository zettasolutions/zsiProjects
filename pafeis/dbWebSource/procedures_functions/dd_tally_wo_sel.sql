CREATE PROCEDURE [dbo].[dd_tally_wo_sel]
(
  @user_id INT
)
AS
BEGIN

SET NOCOUNT ON
DECLARE @stmt NVARCHAR(MAX)

  SET @stmt = 'SELECT issuance_id, tw_no FROM dbo.issuances_v WHERE ISNULL(tw_no,0) <> 0 ' 
  	 
  EXEC(@stmt)
END

