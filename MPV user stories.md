# Product Brief

PickArt is an online platform that connects artists with property owners (hotels and short-term rentals) and their guests, to display and sell the artists' work (AW). The platform facilitates the interaction between the guests and the art, and enables guests to buy the art directly from the artist.

PickArt generates revenue by charging a small fee per AW per night for art displayed in short-term rentals and by sharing the revenue from art sales between the artist, the property owner, and PickArt.


## Primary Business Model

The PickArt primary business model connects artists/agents with short-term rental property owners and managers (hosts), and guests.

- Properties are evaluated to determine if they have appropriate space to display AW (AW). The space must be able to accommodate the AW's artistic style, price, weight, dimensions and fixture method.
- The unique spots are entered into PickArt’s database, assigned a QR code, and placed at the spots within the properties
- An AW that matches the spot's requirements is allocated to the spot.
- Once the host approves the AW (host approval flow can be turned on/off), PickArt facilitates communication between the artist and host to deliver and install the art.
- The QR code in the allocated spot will redirect to a dedicated page with information about the displayed AW.
- A guest staying in the property is charged an ArtBonus of 0.1% of the sale price of the AW per night.
- When an AW is sold, it is shipped to the guest, and the space is immediately filled with a new AW. The same QR code is used for the new AW.
- Revenue from ArtBonus is paid by the host to PickArt (who further distributes it to artist if applicable, based on business rules)
- Revenue from AW sale is collected by PickArt and distributed to owner and artist (if applicable, based on business rules)

## Platform description

The software should enable artists or art agents to upload their AW along with all the necessary details. This information should then be verified and approved by a PickArt administrator before the AW's webpage is created. The webpage should display the Artist's name, AW title, year, price, short description, technical parameters (such as dimensions) and photographs.

The webpage must also include a clear and straightforward purchase option. The checkout process should offer delivery or self-pickup (if the user/purchaser is physically at the AW's location). Additionally, the software should allow the creation of data entries for spots. If a spot is empty or needs a replacement, the administrator can allocate it with an available AW. The allocation should be saved by the software and become active once the AW is placed at the spot. At that time, the spot's QR code should redirect to the AW's webpage.


# MVP Epics & User Stories (Phase 0\)

1. **User Registration, Authentication and Management**  
   1. User stories:  
      1. As an admin, I want to be able to create a host/artist or guest account  
         1. Artist User:  
            1. Artist/agent (selection)  
            2. First Name:  
            3. Last Name:  
            4. Email:  
            5. Address:  
            6. Phone Number:  
            7. Artist display name:  
            8. Bank account name:  
            9. Bank account address:  
            10. Bank account number:  
            11. Signed artist contract: y/n  
         2. Host User:  
            1. Host/owner (selection)  
            2. First Name:  
            3. Last Name:  
            4. Email:  
            5. Address:  
            6. Phone Number:  
            7. Business name (optional):  
            8. Bank account name:  
            9. Bank account address:  
            10. Bank account number:  
            11. Signed host contract: y/n  
      2. As an admin, I want to be able to approve or reject user registrations.  
2. **AW Registration, Approval and Management**  
   * User stories:  
     * As an admin, I want to be able to upload AW to the PickArt platform, including all necessary information:  
       * Artist name  
       * AW ID (sys generated)- AWCH-XXX-XX random 5 digit alphanumeric  
       * AW Title  
       * Year  
       * Place  
       * Text description (Artists’ notes)  
       * Style  
       * Medium  
       * Unique/edition  
       * Dimensions  
       * Weight  
       * Price  
     * As an admin, I want to be able to make edits, sort, search and approve submitted AW before it is made available to hosts.  
2. **Spot Registration, Approval and Management**  
   * User stories:  
     * As an admin, I want to be able to create different rental properties and submit data including:  
       * Property ID (sys generated)- APCH-XXX-XX random 5 digit alphanumeric  
       * Property Name\*  
       * Address:  
         1. Street and number\*  
         2. City\*  
         3. State\*  
         4. Postcode\*  
         5. Country\*  
       * Property type\*:  
         1. Multi-room apartment  
         2. 1-room apartment (studio)  
         3. House  
         4. Gallery  
         5. Mall (retail)  
         6. Hotel (lobby)  
         7. Hotel (rooms)  
         8. Hostel  
         9. Hut  
         10. Mini-home  
         11. Tent  
         12. Restaurant  
         13. Cafe  
         14. Bar  
         15. School  
         16. Other: please specify  
       * Total property size (sqm / sqft)  
       * Total number of floors (integer)  
       * Total number of rooms (integer)  
       * Owner (user?)  
       * Host admin users (user?)  
       * Contact phone number (Country code \+ dialling code)  
     * As an admin, I want to be able to upload photos of rental property and identify specific/submit spots where AW can be displayed.  
       * Spot ID (sys generated)- ASCH-XXX-XX random 5 digit alphanumeric  
       * Spot location data includes  
         1. Floor (integer)  
         2. Room (free text)  
         3. Position (free text)  
       * Spot AW requirement data includes:  
         1. Preferred artistic style  
         2. Colour scheme  
         3. Fixture method\*  
         4. AW weight\*  
         5. AW dimensions\*  
         6. AW price  
     * As an admin, I want to be able to review, edit, sort, search and approve submitted spots before they are available for AW-Spot Allocation.  
     * As a admin/host, I want to be able to link a QR code on hand to an AW I am hanging up at a designated spot (pre-designated by PickArt).  
3. **AW-Spot Allocation**  
   * User stories:  
     * As an admin, I want to be able to manually allocate AW to spots based on factors such as color scheme and size. (suggested: by clicking the current spot/AW status and allocating)  
     * As an artist, I want to receive an email/notification with delivery instructions for allocated AW to host location(s)  
     * As a host, I want to receive an email/notification informing me that AW has been allocated to my available spots and details of artist delivery   
     * (As the platform evolves, we want to develop an algorithm that can automatically suggest AW-spot pairings.)  
     * As a admin/host, I want to be able to link a QR code on hand to an AW I am hanging up at a designated spot (pre-designated by PickArt).  
     * As an admin, I want to be able to see/change the status of each AW and spot  
       * AW statuses:  
         1. ⭘ DRAFT (by artist)  
         2. ⭘ PENDING approval (by admin)  
         3. ⭘ READY for spot allocation  
         4. ⭘ ALLOCATED to spot- ASCH-XXX-XX (click through to spot data)  
         5. ⭘ DELIVERED to spot/stock- ASCH-XXX-XX (click through to spot data)  
         6. ⭘ LIVE on spot- ASCH-XXX-XXX (click through to spot data)  
       * Spot statuses:  
         1. ⭘ DRAFT (by host/owner)  
         2. ⭘ PENDING approval (by admin)  
         3. ⭘ READY for AW allocation  
         4. ⭘ ALLOCATED with AW- AWCH-XXX-XX (click through to AW data)  
         5. ⭘ LIVE with AW- AWCH-XXX-XX (click through to AW data)  
     * ID string structure:  
       * AP (art property) XX (country code) \- random 5 digit alphanumeric   
       * AS (art spot) XX (country code) \- random 5 digit alphanumeric   
       * AW (artwork) XX (country code) \- random 5 digit alphanumeric   
4. **AW Landing Page and Sales Checkout Process**  
   * User stories:  
     * As a guest, I want to be able to purchase AW that I see in a rental property through the PickArt platform by scanning a QR code that takes me to the AW page  
     * As a guest, I want to be able to share the AW page via social media:  
       * Email  
       * Whatsapp  
       * Facebook  
       * Instagram  
     * As a guest, I want to be able to purchase the AW and receive confirmation  
       * Payment options:  
         1. Google Pay, Apple Pay, Credit Card (stripe/paypal)  
     * As a guest, I want to be able to select a delivery option (“PickArt, Take it Home” or delivery)  
     * As a guest (buyer), I want to be able to share a snapshot my purchased AW on social media  
       * Whatsapp  
       * Facebook  
       * Instagram  
       * Download sharing image/banner  
     * As a guest (buyer), I want to be able to download the pdf “AW Release Voucher” which details the pickup / delivery instructions  
     * As a guest (buyer), I want to be able to download the pdf “Certificate of Authenticity” which details:  
       * **PickArt Certificate of Authenticity**  
         1. Artist  
         2. Title  
         3. Year  
         4. Medium  
         5. Dimensions  
         6. Unique/edition  
         7. Signature  
         8. Notes:  
         9. *This certificate, AWCH-XXX-XX (PickArt AW ID), certifies this artwork is an authentic creation and official part of the Artist’s oeuvre, curated and showcased by PickArt.*  
         10. Purchase date  
         11. Place  
         12. PickArt seal (logo) and signature of CEO and/or Art Director  
     * As an admin/owner/host I want to receive a notification of an ArtSale detailing the time and location of the sale, and instructions for delivery pickup and/or replacement of the AW at the spot