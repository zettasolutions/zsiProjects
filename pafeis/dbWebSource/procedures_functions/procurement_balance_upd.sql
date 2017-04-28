
CREATE PROCEDURE [dbo].[procurement_balance_upd]
(
    @procurement_id int
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE dbo.procurement_detail
            SET  balance_quantity  = quantity
      WHERE procurement_id = @procurement_id
END






