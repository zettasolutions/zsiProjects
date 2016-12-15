-- ========================================================================================================================
-- Author:		Rogelio T. Novo Jr.
-- Create date: December 14, 2016 7:08PM
-- Description:	Insert and update disposal of item.
-- ========================================================================================================================
-- Updated by	| Date			| Description
-- ========================================================================================================================
-- RNovo		| 12/15/2016	| Removed Unit of Measure and added update script to change the item status_id to disposed.
-- ========================================================================================================================

CREATE PROCEDURE [dbo].[disposal_item_upd]
(
    @tt    disposal_item_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
    SET  item_id				= b.item_id
		,quantity				= b.quantity
		,authority_ref			= b.authority_ref
		,remarks				= b.remarks
		,status_id				= b.status_id
        ,updated_by				= @user_id
        ,updated_date			= GETDATE()
    FROM dbo.disposal_item a INNER JOIN @tt b
    ON a.disposal_item_id = b.disposal_item_id
    WHERE (
			isnull(a.item_id,0)				<> isnull(b.item_id,0)  
		OR	isnull(a.quantity,0)			<> isnull(b.quantity,0)  
		OR	isnull(a.authority_ref,'')		<> isnull(b.authority_ref,'')  
		OR	isnull(a.remarks,'')			<> isnull(b.remarks,'')  
		OR	isnull(a.status_id,0)			<> isnull(b.status_id,0)  
	)
	   
-- Insert Process
    INSERT INTO dbo.disposal_item (
         item_id
		,quantity
		,authority_ref
		,remarks
		,status_id
        ,disposed_by
        ,disposed_date
        )
    SELECT 
        item_id	
	   ,quantity
	   ,authority_ref
	   ,remarks
	   ,status_id
       ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE disposal_item_id IS NULL;

-- Update Items status_id to "Disposed"
	DECLARE @itemId INT = 0;
	DECLARE @statusId INT = 0;

	SELECT @itemId = item_id, @statusId= status_id 
	FROM dbo.disposal_item 
	WHERE disposal_item_id = @@IDENTITY;

	UPDATE dbo.items
	SET status_id = @statusId
	WHERE item_id = @itemId;

END


